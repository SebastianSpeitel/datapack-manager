# Datapack-manager

Control your datapacks from the commandline.

## Installation

Install datapack-manager globally.

```bash
npm install datapack-manager -g
```

## CLI

### List

Lists local datapacks found in the global directory and worldsaves.

```
datapack-manager list

List local datapacks

Options:
  --version          Show version number                               [boolean]
  --help             Show help                                         [boolean]
  --description, -d  Print descriptions                [boolean] [default: true]
  --border, -b       Prints borders around the table   [boolean] [default: true]
  --location         Print locations                   [boolean] [default: true]
  --dereference, -L  Dereference symlinks             [boolean] [default: false]
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
```

### Uninstall

Removes a datapack from a world.

```
datapack-manager uninstall <pack> <world>

Uninstall a datapack

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
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
