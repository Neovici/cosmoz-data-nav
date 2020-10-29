# see https://nixos.wiki/wiki/Development_environment_with_nix-shell
{}:
with import
  (
    builtins.fetchTarball {
      url = "https://github.com/NixOS/nixpkgs/archive/1dc37370c489.tar.gz";
      sha256 = "1qvfxf83rya7shffvmy364p79isxmzcq4dxa0lkm5b3ybicnd8f4";
    }
  )
{ };
mkShell {
  buildInputs = [ nodejs-12_x firefox google-chrome ];
  shellHook = ''
    export PATH=$(npm bin):$PATH
  '';
}
