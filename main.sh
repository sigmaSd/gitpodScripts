curl -fsSL https://deno.land/install.sh | sh
export DENO_INSTALL="/home/gitpod/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
deno run -A -r --unstable "https://raw.githubusercontent.com/sigmaSd/gitpodScripts/main/main.ts"
