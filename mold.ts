import { $, $t, simpleRun } from "./deps.ts";

export const installMold = async () => {
  const releasePage = await fetch(
    "https://github.com/rui314/mold/releases/latest",
  ).then((r) => r.text());

  const moldUrl = "https://github.com" +
    releasePage.match(/href="(.*mold-.*-x86_64-linux.tar.gz)"/)![1];

  $t`wget -O mold.tar.gz ${moldUrl}`;
  $t`tar -xzf mold.tar.gz`;
  $t`rm mold.tar.gz`;
  simpleRun("sh -c mv mold-*-x86_64-linux mold");

  $`mkdir .cargo`; // ignore exists error

  // cargo and cargo.toml are both valid
  // check if there is one already and use it
  let cargoConfig;
  if ("./cargo/config".pathExists()) {
    cargoConfig = "./cargo/config";
  } else {
    // default to cargo.toml
    cargoConfig = "./cargo/config.toml";
  }

  $t`echo 
'[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=/workspace/deno/mold/bin/mold"]' >> ${cargoConfig}`;
};
