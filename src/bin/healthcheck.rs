use std::{env, process::ExitCode};

// https://natalia.dev/blog/2023/03/docker-health-checks-on-distroless-containers-with-rust/

#[inline]
fn run(endpoint: &str, timeout: u64) -> Result<minreq::Response, minreq::Error> {
    minreq::get(endpoint).with_timeout(timeout).send()
}

fn main() -> ExitCode {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 || args.len() > 3 {
        eprintln!("Usage: {} [endpoint] <timeout=3>", args[0]);
        return ExitCode::from(2);
    }

    let endpoint = args.get(1).unwrap();
    let timeout = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(3);

    println!("Healthcheck {} with {}s timeout", endpoint, timeout);
    let res = run(endpoint, timeout);

    println!("Healthcheck response: {:?}", res);

    if res.is_err() {
        println!("Healthcheck failed: {}", res.unwrap_err());
        return ExitCode::from(1);
    }

    let code = res.unwrap().status_code;

    if code > 299 {
        println!("Received status code: {}", code);
        return ExitCode::from(1);
    }

    ExitCode::from(0)
}
