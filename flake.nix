{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
	};

	outputs = { self, nixpkgs }@inputs:
	let
		system = "x86_64-linux";
		
		pkgs = import inputs.nixpkgs{
			inherit system;
			config.allowUnfree = true;
		};
	in 
	{
		devShells.${system}.default = pkgs.mkShell rec {
			name="Cardvalley";
			packages = with pkgs; [
				bun
				];
			shellHook = "tmux -L Cardvalley new-session -A -s Cardvalley";
			};
		};
	}
