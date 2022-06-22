import { $ } from "https://deno.land/x/simple_shell@0.5.0/mod.ts";

const releasePage = await fetch(
  "https://github.com/rui314/mold/releases/latest",
).then((r) => r.text());

const moldUrl = "https://github.com" +
  releasePage.match(/href="(.*mold-.*-x86_64-linux.tar.gz)"/)![1];

$`wget -O mold ${moldUrl}`;

$`mkdir .cargo`;

// cargo and cargo.toml are both valid
// check if there is one already and use it
let cargoConfig;
if (pathExist("./cargo/config")) {
  cargoConfig = "./cargo/config";
} else {
  // default to cargo.toml
  cargoConfig = "./cargo/config.toml";
}

$`echo 
'[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=/workspace/deno/mold/bin/mold"]' >> ${cargoConfig}`;

function pathExist(filePath: string): boolean {
  try {
    Deno.statSync(filePath);
    return true;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw e;
    }
  }
}
