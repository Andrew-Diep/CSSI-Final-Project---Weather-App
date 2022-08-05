{ pkgs }: {
  deps = [
    pkgs.mesa-demos
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}