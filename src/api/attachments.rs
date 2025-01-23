use std::{env, sync::LazyLock};

use ntex::{
    http::{header::HeaderValue, Client, HttpMessage},
    web,
};

use crate::discord::fetch_attachment;

static ATTACHMENT_TOKEN: LazyLock<HeaderValue> = LazyLock::new(|| {
    HeaderValue::from_str(&format!(
        "Bearer {}",
        env::var("ATTACHMENT_TOKEN").expect("You need to provide an attachment token!")
    ))
    .unwrap()
});

#[web::get("/attachments/{channel_id}/{attachment_id}/{file_name}")]
async fn get_attachment(
    client: web::types::State<Client>,
    path: web::types::Path<(String, String, String)>,
    req: web::HttpRequest,
) -> web::HttpResponse {
    if req.headers().get("Authorization") != Some(&ATTACHMENT_TOKEN) {
        return web::HttpResponse::Unauthorized().body("Unauthorized");
    }

    let (channel_id, attachment_id, file_name) = path.into_inner();

    let res = fetch_attachment(&client, &channel_id, &attachment_id, &file_name).await;

    if let Err(e) = res {
        return web::HttpResponse::InternalServerError().body(format!("Error: {}", e));
    }

    let res = res.unwrap();

    web::HttpResponse::build(res.status())
        .content_type(res.content_type())
        .streaming(res)
}
