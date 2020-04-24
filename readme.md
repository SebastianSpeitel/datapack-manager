# Datapack-manager

Control your datapacks from the commandline.

## Installation

Install datapack-manager globally.

```bash
npm install datapack-manager -g
```

## CLI

### List

Lists local datapacks found in the cache directory and worldsaves.

```
datapack-manager list

List local datapacks

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --root, -r  Path of the minecraft folder
                                                         [string] [default: ...]
  --desc, -d  Print descriptions                                 [default: true]
```

### Install

Install a datapack into a world. `pack` can be the name or the absolute path.

```
datapack-manager install <pack> <world>

Install a datapack

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --mode, -m  Install mode
            [choices: "symlink", "copy", "compile", "move"] [default: "symlink"]
  --root, -r  Path of the minecraft folder
                                                         [string] [default: ...]
```

### Uninstall

Removes a datapack from a world.

```
datapack-manager uninstall <pack> <world>

Uninstall a datapack

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --root, -r  Path of the minecraft folder
                                                         [string] [default: ...]
```

### Create

Creates a minimal datapack from the given options.

```
datapack-manager create

Create a new datapack

Options:
  --version                  Show version number                       [boolean]
  --help                     Show help                                 [boolean]
  --name, -n                 Name of the datapack            [string] [required]
  --description, -d, --desc  Description for the datapack               [string]
```

### Configuration

Change configuration options.

```
datapack-manager config <key> [<value>]

Configure datapack-manager

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
