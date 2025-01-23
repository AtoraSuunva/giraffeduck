use std::borrow::Cow;

use ntex::web;

#[derive(serde::Deserialize)]
struct QueryOptions {
    line: Option<i32>,
    word: Option<String>,
    count: Option<String>,
}

static BEE_MOVIE: &'static str = include_str!("../../public/beemovie.txt");

#[web::get("/bee")]
async fn bee_movie(query: web::types::Query<QueryOptions>) -> impl web::Responder {
    let QueryOptions { line, word, count } = query.into_inner();

    let mut body: Cow<str> = Cow::Borrowed(BEE_MOVIE);

    // Get a specific line by line number
    if let Some(line) = line {
        // I don't get this reference anymore
        // 2025 addendum: I still don't, this has been here since 2017 when this was a hacky cgi-node setup on shared hosting
        // Whatever joke/reference I was making then has since been lost to time, and trying to search up history brings up nothing
        // But it's survived 8 years and 3 rewrites
        if line == 3054 {
            return web::HttpResponse::Ok().body("It's hip!");
        }

        body = Cow::Owned(
            body.lines()
                .nth(line as usize)
                .unwrap_or("Line not found")
                .to_string(),
        );
    }

    // Get all lines that contain this word
    if let Some(word) = word {
        body = Cow::Owned(
            body.lines()
                .filter(|line| line.contains(&word))
                .collect::<Vec<&str>>()
                .join("\n"),
        );
    }

    // Count the number of times a word appears in the text
    if let Some(count) = count {
        body = Cow::Owned(
            body.split_whitespace()
                .filter(|word| word.eq_ignore_ascii_case(&count))
                .count()
                .to_string(),
        );
    }

    web::HttpResponse::Ok()
        .content_type("text/plain")
        .body(body.into_owned())
}
