import { installMold } from "../mold.ts";
import { assert } from "https://deno.land/std@0.130.0/testing/asserts.ts";

Deno.test("test mold", async () => {
  const dir = Deno.makeTempDirSync();
  Deno.chdir(dir);

  const p = Deno.run({ cmd: ["cargo", "new", "tester"] });
  await p.status();
  p.close();

  Deno.chdir("tester");

  await installMold();

  const p2 = Deno.run({
    cmd: ["cargo", "b", "--target-dir", "target"],
  });
  assert((await p2.status()).success);
  p2.close();

  const p3 = Deno.run({
    cmd: ["readelf", "-p", ".comment", "target/debug/tester"],
    stdout: "piped",
  });
  assert(
    (await p3.output().then((o) => new TextDecoder().decode(o))).includes(
      "mold",
    ),
  );
  p3.close();
});
