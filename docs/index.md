# Welcome to the Formula.Bot wiki!

> Formula.Bot is a .NET application that adds computer assisted commands to discord that allow you to do various tasks such as moderation and more. Because of the plugin principle used in this application the main lightweight project can be expanded using third- or first party plugins.

| .NET Version | License |
| --- | --- |
| 5.0.5 | GPLv3 |

| Discord Engine | Database Engine | HTTP Engine<sup>*</sup> | Plugin Loader |
| --- | --- | --- | --- |
| Discord.NET | LiteDB  InfluxDB<sup>**</sup> | GenHTTP | AssemblyContextLoader  <sup>@`System.Runtime.Loader`</sup> |

<sup>_\*HTTP Engine is from a first party plugin, named "Formula.Bot.Plugins.WebAPI"._</sup>  
<sup>_\*InfluxDB is only used in a first party plugin, named "Formula.Bot.Plugins.Metrics"._</sup>