import { $, CommandBuilder } from "./deps.ts";

export const installMold = async () => {
  const version = await fetch(
    "https://github.com/rui314/mold/releases/latest",
  ).then((r) => r.url).then((u) => u.match(/(v.*)/)![1]);

  //https://github.com/rui314/mold/releases/download/v1.4.2/mold-1.4.2-x86_64-linux.tar.gz
  const moldUrl =
    `https://github.com/rui314/mold/releases/download/${version}/mold-${
      version.slice(1)
    }-x86_64-linux.tar.gz`;

  await $`rm -rf mold`; // clean previous usage

  await $`wget -O mold.tar.gz ${moldUrl}`;
  await $`tar -xzf mold.tar.gz`;
  await $`rm mold.tar.gz`;

  const downloadedMold =
    $.fs.expandGlobSync("mold-*-x86_64-linux").next().value.name;
  await $`mv  ${downloadedMold} mold`;

  await new CommandBuilder().command(["mkdir", ".cargo"]).noThrow().quiet().spawn(); // ignore file exists

  // cargo and cargo.toml are both valid
  // check if there is one already and use it
  let cargoConfig;
  if ($.existsSync("./.cargo/config")) {
    cargoConfig = "./.cargo/config";
  } else {
    // default to cargo.toml
    cargoConfig = "./.cargo/config.toml";
  }

  Deno.writeTextFileSync(
    cargoConfig,
    `

[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=${Deno.cwd().trim()}/mold/bin/mold"]`, // for some reason trim is needed.
    { append: true },
  );
};
