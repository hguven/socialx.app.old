fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
## iOS
### ios version
```
fastlane ios version
```
Create new version
### ios build
```
fastlane ios build
```
Build the iOS application
### ios send_testflight
```
fastlane ios send_testflight
```
Upload to TestFlight
### ios bugsnag
```
fastlane ios bugsnag
```
Send sources to BugSnag
### ios release
```
fastlane ios release
```
Entire build and upload flow

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
