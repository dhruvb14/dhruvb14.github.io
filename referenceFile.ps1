# Template borrowed from http://blog.zerosharp.com/provisioning-a-new-development-machine-with-boxstarter/
# Boxstarter options
$Boxstarter.RebootOk=$true # Allow reboots?
$Boxstarter.NoPassword=$false # Is this a machine with no login password?
$Boxstarter.AutoLogin=$true # Save my password securely and auto-login after a reboot

if (Test-PendingReboot) { Invoke-Reboot }

# Update Windows and reboot if necessary
Install-WindowsUpdate -AcceptEula
if (Test-PendingReboot) { Invoke-Reboot }

# Install Visual Studio 2013 Ultimate
choco install visualstudio2013ultimate
if (Test-PendingReboot) { Invoke-Reboot }

choco install DotNet3.5 # Not automatically installed with VS 2013. Includes .NET 2.0. Uses Windows Features to install.
if (Test-PendingReboot) { Invoke-Reboot }

# Install Visual Studio 2015 Ultimate
choco install visualstudio2015enterprise
if (Test-PendingReboot) { Invoke-Reboot }

# Install O365 Business
choco install office365business
if (Test-PendingReboot) { Invoke-Reboot }


#Other dev tools
choco install fiddler4
choco install NugetPackageExplorer
choco install linqpad4
choco install notepadplusplus.install
choco install visualstudiocode
choco install resharper
choco install git
choco install windowsazurepowershell
choco install cyberduck
choco install silverlight
choco install adobeair
choco install nodejs.install #Used for Grunt in VS2015

#Browsers
choco install googlechrome
choco install firefox

#Other essential tools
choco install 7zip
choco install adobereader
choco install javaruntime

#Password Managers
choco install lastpass
choco install keepass

#cinst Microsoft-Hyper-V-All -source windowsFeatures
#cinst IIS-WebServerRole -source windowsfeatures
#cinst IIS-HttpCompressionDynamic -source windowsfeatures
#cinst IIS-ManagementScriptingTools -source windowsfeatures
#cinst IIS-WindowsAuthentication -source windowsfeatures
#Not working in windows 10 Install-ChocolateyPinnedTaskBarItem "$($Boxstarter.programFiles86)\Google\Chrome\Application\chrome.exe"
#Not working in windows 10 Install-ChocolateyPinnedTaskBarItem "$($Boxstarter.programFiles86)\Microsoft Visual Studio 12.0\Common7\IDE\devenv.exe"
#Not working in windows 10 Install-ChocolateyPinnedTaskBarItem "$($Boxstarter.programFiles86)\Microsoft Visual Studio 14.0\Common7\IDE\devenv.exe"