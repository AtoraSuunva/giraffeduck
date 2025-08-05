use std::{fs, path::Path, sync::LazyLock};

use ntex::web;
use rand::prelude::IndexedRandom;

#[derive(serde::Deserialize)]
struct QueryOptions {
    direct: Option<i32>,
}

#[derive(serde::Serialize)]
struct FoxImg {
    url: String,
    src: Option<String>,
}

static FOX_BASE: &'static str = "./public";
static FOX_DIR: &'static str = "./public/api/fox/img";
static FOX_IMG: LazyLock<Vec<String>> = LazyLock::new(|| walk_dir(FOX_DIR).unwrap());

fn walk_dir(dir: impl AsRef<Path>) -> Result<Vec<String>, std::io::Error> {
    let mut files = Vec::new();

    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            files.extend(walk_dir(&path)?);
        } else {
            files.push(path.to_string_lossy().to_string());
        }
    }

    Ok(files)
}

/// Return the tweet url of a specific file
///
/// The original tweet author's handle and tweet ID are stored in the url:
/// `/api/fox/img/@{handle}/{id}.ext`
///
/// Some images have no source and do not start with an @:
/// `/api/fox/img/NoSource/{id}.ext`
fn tweet_url(path: impl AsRef<str>) -> Option<String> {
    let file = path.as_ref().replacen(FOX_DIR, "", 1);
    let handle = file.rsplitn(2, '/').nth(1)?.trim_start_matches("/");

    if !handle.starts_with("@") {
        return None;
    }

    let id = file.rsplitn(2, '/').next()?.split(".").nth(0)?;

    Some(format!("https://twitter.com/{}/status/{}", handle, id))
}

#[web::get("/fox")]
async fn fox(req: web::HttpRequest, query: web::types::Query<QueryOptions>) -> impl web::Responder {
    let base = format!(
        "{}://{}",
        req.connection_info().scheme(),
        req.connection_info().host()
    );

    let QueryOptions { direct } = query.into_inner();

    // If the user specified a direct image, redirect to it
    if let Some(direct) = direct {
        let redirect = FOX_IMG.get((direct as usize) % FOX_IMG.len());

        if let Some(redirect) = redirect {
            return web::HttpResponse::TemporaryRedirect()
                .header("Location", redirect.replacen(FOX_BASE, &base, 1))
                .finish();
        }

        return web::HttpResponse::NotFound().body("404 Not Found");
    }

    // Otherwise, pick a random image and return data about it as JSON
    let redirect = FOX_IMG.choose(&mut rand::rng());

    if let Some(redirect) = redirect {
        return web::HttpResponse::Ok().json(&FoxImg {
            url: redirect.replacen(FOX_BASE, &base, 1),
            src: tweet_url(redirect),
        });
    }

    web::HttpResponse::NotFound().body("404 Not Found")
}

#[web::get("/fox/direct")]
async fn fox_direct(req: web::HttpRequest) -> impl web::Responder {
    let base = format!(
        "{}://{}",
        req.connection_info().scheme(),
        req.connection_info().host()
    );

    // Pick a random image from FOX_IMG
    let redirect = FOX_IMG.choose(&mut rand::rng());

    if let Some(redirect) = redirect {
        return web::HttpResponse::TemporaryRedirect()
            .header("Location", redirect.replacen(FOX_BASE, &base, 1))
            .finish();
    }

    web::HttpResponse::NotFound().body("404 Not Found")
}
