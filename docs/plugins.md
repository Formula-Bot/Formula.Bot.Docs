# Plugin development
> Formula.Bot uses a plugin pattern to keep it's core functionally lightweight. If you wish to extend Formula.Bot, you can do so by installing, or developing your own plugins. This page will explain you how to create or install already existing plugins.

[[toc]]

## Creating a new plugin using the plugin template
To create a plugin using the plugin template, you will first have to install the plugin template. You can do this by using the `dotnet` cli command. This allows you to create a new project based on the provided template with one simple command.
1. Make sure the plugin template is installed correctly by executing the following command:
```sh
dotnet new -i Formula.Bot.Templates.Plugin
```
2. Create a new project with the provided template:
```sh
dotnet new formulabot-plugin -n "Formula.Bot.Plugins.Example" -o Formula.Bot.Plugins.Example
```
`-o` -> Output directory to use  
`-n` -> Namespace to use   
3. Confirm the project got created with the correct namespace & folder used.
Because you used the plugin template, you will not have to do all the tedious tasks related to the csproj described in "Creating a new plugin". Do note that you can still execute step 6 from that instruction for automatic build artifacts copying.

## Creating a new plugin
To create a new plugin, make sure the used .NET SDK is installed. Currently, the bot runs on [.NET 5](https://dotnet.microsoft.com/download/dotnet/5.0), but this may be changed in the future. Just make sure this matches the core project, as you might otherwise run into issues.  
> _This instruction assumes you use the Visual Studio Code IDE._
1. Create a new class library with the following naming convention: `Formula.Bot.Plugins.PluginNamePascalCased`. For example, a plugin with the name MyPlugin would become `Formula.Bot.Plugins.MyPlugin`.
```sh
dotnet new classlib -n "Formula.Bot.Plugins.{PLUGIN_NAME}" -o "Formula.Bot.Plugins.{PLUGIN_NAME}"
```
eg
```sh
dotnet new classlib -n "Formula.Bot.Plugins.MyPlugin" -o "Formula.Bot.Plugins.MyPlugin"
```
2. Add the `csproj` to the main `sln` file:
```sh
dotnet sln add "Formula.Bot.Plugins.{PLUGIN_NAME}/Formula.Bot.Plugins.{PLUGIN_NAME}.csproj"
```
eg
```sh
dotnet sln add "Formula.Bot.Plugins.MyPlugin/Formula.Bot.Plugins.MyPlugin.csproj"
```
3. Add a reference to the core project:
```sh
dotnet add "Formula.Bot.Plugins.{PLUGIN_NAME}/Formula.Bot.Plugins.{PLUGIN_NAME}.csproj" reference "Formula.Bot/Formula.Bot.csproj"
```
eg
```sh
dotnet add "Formula.Bot.Plugins.MyPlugin/Formula.Bot.Plugins.{PLUGIN_NAME}.csproj" reference "Formula.Bot/Formula.Bot.csproj"
```
4. To make sure the referenced core project does not get outputted when building, find and change the `ProjectReference` to add `<Private>true</Private>` & `<ExcludeAssets>runtime</ExcludeAssets>`
```xml
<ProjectReference Include="..\Formula.Bot\Formula.Bot.csproj">
  <Private>false</Private>
  <ExcludeAssets>runtime</ExcludeAssets>
</ProjectReference>
```
5. Add `<CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>` to the first `PropertyGroup`.
6. (optional) For easier plugin output copying to the core project, add the following part to your csproj:
```xml
<Target Name="PostBuild" AfterTargets="PostBuildEvent">
  <Exec Command="mkdir -p &quot;$(SolutionDir)Formula.Bot/Plugins&quot;;cp -RTf &quot;$(TargetDir)&quot; &quot;$(SolutionDir)Formula.Bot/Plugins/$(TargetName)&quot;" />
</Target>
```
7. Your finished `csproj` should look something like this:
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net5</TargetFramework>
    <FileVersion>1.0.0</FileVersion>
    <AssemblyVersion>1.0.0</AssemblyVersion>
    <CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference Include="..\Formula.Bot\Formula.Bot.csproj">
      <Private>false</Private>
      <ExcludeAssets>runtime</ExcludeAssets>
    </ProjectReference>
  </ItemGroup>

  <!-- Optional -->
  <Target Name="PostBuild" AfterTargets="PostBuildEvent">
    <Exec Command="mkdir -p &quot;$(SolutionDir)Formula.Bot/Plugins&quot;;cp -RTf &quot;$(TargetDir)&quot; &quot;$(SolutionDir)Formula.Bot/Plugins/$(TargetName)&quot;" />
  </Target>
</Project>
```
8. Project & solution wise, you are done. Now, you need to make sure your initial `Plugin` class implementation exists. Add a file called `Core.cs` that implements the `Plugin` class from the `Formula.Bot.Abstractions` namespace.
```csharp
using Formula.Bot.Abstractions;

namespace Formula.Bot.Plugins.MyPlugin
{
    public class Core : Plugin
    {
        public override string Name { get; } = "MyPlugin";

        public override string Description { get; } = "This is my super cool plugin. Yup, I made this myself.";
    }
}
```
9. This is the minimal you need for your plugin to be recognized. Though, this in and of itself is not quite useful. Let's add a `Activate` event handler. This is a virtual method in the `Plugin` class that you can override by typing
```csharp
// ...
        public override Task Activate()
        {
            return base.Activate();
        }
// ...
```
In here, you can add anything you want to be executed when the plugin gets loaded in and initialized.  
10. Though, at some point you may also want to reload a plugin. For that to work, you will also need to register a `Terminate` handler in the event that you leave any existing references to the core project that the GC cannot cleanup.
> **Note!** It is very important to make sure your referenced objects are cleaned up, otherwise you may leak the PluginContextLoader which leads to a wrong unloaded plugin that may result in unexpected behavior.
```csharp
// ...
        public override Task Terminate()
        {
            return base.Terminate();
        }
// ...
```

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

## Configuration
> For plugins, Formula.Bot allows you to load in `.json` files from a specified directory. You must enable this feature manually within your `Plugin` instance, explained below.

### Enabling Configuration for Plugin
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

### Adding Plugin Configuration
For plugin configuration, you'll have to create a `.json` settings file per plugin. To do such a thing, first make sure your `settings.json` file is reading the correct plugin config folder location. This can be specified using the `$.PluginLoader.PluginConfigFolder` property in the settings file. By default this is `data/plugins`. If you mounted the working container in your docker-compose file to `data`, you can just create a new folder called `plugins` and place your configuration files in there. Make sure the plugin configuration files follow the following format: `PluginName.settings.json`.
