{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs.buildPackages; [ 
      yarn
      nodejs_20
      #solc-select
      solc
      nodePackages_latest.typescript-language-server
    ];
}
