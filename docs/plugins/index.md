# Initial Installation
> To enable a plugin you'll have to add it to your service volume collection. Read below on how to do that.

[[toc]]

## Adding a plugin to the container
To add a new plugin to an existing deployed container, follow the following steps.
First, determine which plugin you would like to add. You will need the part after `Formula.Bot.Plugins.`  
> `{PLUGIN_NAME}` -> The part that comes right after `Formula.Bot.Plugins.` in the repository name.  
> `{LOWERCASE_PLUGIN_NAME}` -> Same as `PLUGIN_NAME`, but well.. in lowercase.
1. Add the following part to the `docker-compose.plugins.yml` file. If this file does not exist, please follow step 4 of the deployment instruction.
```yml
services:
  formulabot:
    volumes:
      - formulabot-plugin-{LOWERCASE_PLUGIN_NAME}:/app/Plugins/Formula.Bot.Plugins.{PLUGIN_NAME}/
volumes:
  formulabot-plugin-{LOWERCASE_PLUGIN_NAME}:
    external: true
```
For example, if you wanted to add the `Formula.Bot.Plugins.Metrics` plugin you'd type:
```yml
services:
  formulabot:
    volumes:
      - formulabot-plugin-metrics:/app/Plugins/Formula.Bot.Plugins.Metrics/
volumes:
  formulabot-plugin-metrics:
    external: true
```
2. Run the following command to create the volumes on your host system. Because these are not managed by Docker Compose (due to the `external: true` part), you'll have to create them yourself.
```sh
docker volume create formulabot-plugins-{LOWERCASE_PLUGIN_NAME}
```
For example with the metrics plugin:
```sh
docker volume create formulabot-plugins-metrics
```
3. If your plugin requires configuration, make sure to write that now, by following the `Adding Plugin Configuration` instructions.
4. Because you modified the `docker-compose.*.yml` file, you'll have to restart your compose containers to apply your changes. After you executed that command, your plugin should be correctly enabled and working.