use std::{
    env,
    error::Error,
    num::NonZeroUsize,
    sync::{LazyLock, Mutex},
    time::SystemTime,
};

use lazy_static::lazy_static;
use lru::LruCache;
use ntex::http::{client::ClientResponse, Client};
use serde::{Deserialize, Serialize};

static CDN_URL: &'static str = "https://cdn.discordapp.com/attachments";
static REFRESH_URLS: &'static str = "https://discord.com/api/v10/attachments/refresh-urls";
static BOT_AUTH: LazyLock<String> = LazyLock::new(|| {
    format!(
        "Bot {}",
        env::var("BOT_TOKEN").expect("You need to provide a bot token!")
    )
});

pub async fn fetch_attachment(
    client: &Client,
    channel_id: &str,
    attachment_id: &str,
    file_name: &str,
) -> Result<ClientResponse, Box<dyn Error>> {
    let url = format!("{CDN_URL}/{}/{}/{}", channel_id, attachment_id, file_name);
    let refreshed = refresh_url(&client, &url).await?;
    let res = client.get(refreshed.url).send().await?;

    Ok(res)
}

#[derive(Debug, Serialize, Deserialize)]
struct RefreshUrlPayload {
    attachment_urls: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct RefreshedUrl {
    original: String,
    refreshed: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct RefreshResponse {
    refreshed_urls: Vec<RefreshedUrl>,
}

#[derive(Clone)]
struct RefreshedUrlWithExpiry {
    url: String,
    expiry: u128,
}

async fn refresh_url(client: &Client, url: &str) -> Result<RefreshedUrlWithExpiry, Box<dyn Error>> {
    lazy_static! {
        static ref URL_CACHE: Mutex<LruCache<String, RefreshedUrlWithExpiry>> =
            Mutex::new(LruCache::new(NonZeroUsize::new(100).unwrap()));
    }

    if let Some(cached) = URL_CACHE.lock().unwrap().get(url) {
        if cached.expiry > get_unix_millis() {
            return Ok(cached.clone());
        } else {
            // It expired, remove it
            URL_CACHE.lock().unwrap().pop(url);
        }
    }

    let body = RefreshUrlPayload {
        attachment_urls: vec![url.to_string()],
    };

    let mut res = client
        .post(REFRESH_URLS)
        .header("Authorization", BOT_AUTH.as_str())
        .send_json(&body)
        .await?;

    let json = res.json::<RefreshResponse>().await?;

    let refreshed_url = json
        .refreshed_urls
        .get(0)
        .map(|u| u.refreshed.to_owned())
        .unwrap();

    // The expiry time is part of the refreshed URL, stored under the `ex` query parameter (which is base-16 unix seconds)
    let expiry = url::Url::parse(&refreshed_url)
        .map_err(|e| format!("Error parsing URL: {}", e))?
        .query_pairs()
        .find(|(k, _)| k == "ex")
        .map(|(_, v)| u128::from_str_radix(&v, 16).unwrap())
        .unwrap_or(0)
        // It's in seconds, we want milliseconds
        * 1000;

    let refresh = RefreshedUrlWithExpiry {
        url: refreshed_url,
        expiry,
    };

    URL_CACHE
        .lock()
        .unwrap()
        .put(url.to_string(), refresh.clone());

    Ok(refresh)
}

fn get_unix_millis() -> u128 {
    SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis()
}
