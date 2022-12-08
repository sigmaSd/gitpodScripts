import { installMold } from "../mold.ts";
import { assert } from "https://deno.land/std@0.130.0/testing/asserts.ts";

Deno.test("test mold", async () => {
  const dir = Deno.makeTempDirSync();
  console.log(dir);
  Deno.chdir(dir);

  await Deno.run({ cmd: ["cargo", "new", "mold"] }).status();
  Deno.chdir("mold");

  await installMold();

  const status = await Deno.run({
    cmd: ["cargo", "b", "--target-dir", "target"],
  }).status();
  assert(status.success);
});
