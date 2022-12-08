import { $ } from "./deps.ts";

export const installMold = async () => {
  if (Deno.build.os != "darwin") {
    throw `${Deno.build.os} unsuported by mold currently`;
  }

  const req = await fetch(
    "https://github.com/rui314/mold/releases/latest",
  );
  const version = req.url.match(/(v.*)/)![1];
  await req.body?.cancel();

  const targetName = `mold-*-${Deno.build.arch}-${Deno.build.os}.tar.gz`;

  //https://github.com/rui314/mold/releases/download/v1.4.2/mold-1.4.2-x86_64-linux.tar.gz
  const moldUrl =
    `https://github.com/rui314/mold/releases/download/${version}/${
      targetName.replace("*", version.slice(1))
    }`;

  await $`rm -rf mold`.quiet().noThrow(); // clean previous usage

  await $`curl -L -o mold.tar.gz ${moldUrl}`.printCommand();
  await $`tar -xzf mold.tar.gz`;
  await $`rm mold.tar.gz`;

  const downloadedMold =
    $.fs.expandGlobSync(targetName.replace(".tar.gz", "")).next().value.name;
  await $`mv  ${downloadedMold} mold`;

  await $`mkdir .cargo`.noThrow().quiet(); // ignore file exists

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

[target.${Deno.build.target}]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=${Deno.cwd().trim()}/mold/bin/mold"]`, // for some reason trim is needed.
    { append: true },
  );
};
