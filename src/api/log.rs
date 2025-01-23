use std::{str::from_utf8, sync::Arc};

use handlebars::Handlebars;
use ntex::{http::Client, web};
use serde::Serialize;

use crate::discord::fetch_attachment;

static LOG_FILENAME: &'static str = "archive.dlog.txt";

#[derive(Serialize)]
struct ArchiveData {
    archive: String,
    preview: String,
}

#[derive(Serialize)]
struct ArchiveError {
    error: String,
}

#[web::get("/log/{channel_id}-{attachment_id}")]
async fn get_log(
    client: web::types::State<Client>,
    handlebars: web::types::State<Arc<Handlebars<'static>>>,
    path: web::types::Path<(String, String)>,
) -> web::HttpResponse {
    let (channel_id, attachment_id) = path.into_inner();

    let res = fetch_log_attachment(&client, &channel_id, &attachment_id).await;

    if let Err(e) = res {
        let data = ArchiveError {
            error: format!("Error: {}", e),
        };

        let body = handlebars.render("log_viewer", &data).unwrap();
        return web::HttpResponse::InternalServerError()
            .content_type("text/html; charset=utf-8")
            .body(body);
    }

    let res = res.unwrap();

    let data = ArchiveData {
        archive: res.to_string(),
        preview: res.chars().take(100).collect(),
    };

    let body = handlebars.render("log_viewer", &data).unwrap();

    web::HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(body)
}

async fn fetch_log_attachment(
    client: &Client,
    channel_id: &str,
    attachment_id: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    let mut res = fetch_attachment(&client, channel_id, attachment_id, LOG_FILENAME).await?;
    let body = res.body().await?;
    let body = from_utf8(&body)?;

    Ok(body.to_string())
}
