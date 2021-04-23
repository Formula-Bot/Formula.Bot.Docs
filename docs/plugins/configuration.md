# Configuration
> For plugins, Formula.Bot allows you to load in `.json` files from a specified directory. You must enable this feature manually within your `Plugin` instance, explained below.

[[toc]]

## Enabling Configuration for Plugin
By default, plugins are configuration-less; meaning that your plugin has no extra data files attached that it can load. If that is the case however, you will have to define that in your `Plugin` Instance by adding the interface `IPluginSettings` to your implementation. This interface takes one generic argument which is the settings model to deserialize your json to.
```csharp
    // ...
    public class Core : Plugin, IPluginSettings<PluginSettings> // <- note the IPluginSettings
    {
        public override string Name { get; } = "ExamplePlugin";

        public override string Description { get; } = "My example plugin";

        public PluginSettings Settings { get; set; }
    }
    // ...
    public class PluginSettings
    {
        public string MySetting { get; set; }
    }
    // ...
```
Just before calling `Activate`, your plugin will load in your settings file from the specified location in your `PluginConfigFolder`. The filename should follow the following format: `PluginName.settings.json`, eg `ExamplePlugin.settings.json`:
```json
{
    "MySetting": "hello world"
}
```
By default, your deserialized settings type will be provided as the `Settings` property in your plugin implementation. If you wish, you can apply a singleton pattern to it like so:
```csharp
    public class PluginSettings
    {
        public static PluginSettings Instance { get; private set; }

        public string MySetting { get; set; }

        public PluginSettings()
        {
            Instance = this;
        }
    }
```
This allows you to fetch the value from anywhere in your plugin.

## Adding Plugin Configuration
For plugin configuration, you'll have to create a `.json` settings file per plugin. To do such a thing, first make sure your `settings.json` file is reading the correct plugin config folder location. This can be specified using the `$.PluginLoader.PluginConfigFolder` property in the settings file. By default this is `data/plugins`. If you mounted the working container in your docker-compose file to `data`, you can just create a new folder called `plugins` and place your configuration files in there. Make sure the plugin configuration files follow the following format: `PluginName.settings.json`.
