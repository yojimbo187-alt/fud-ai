# Ruoka + Treeni distribution

Ruoka + Treeni remains a bring-your-own-key app. Each friend installs a build and enters their own provider key under **Settings → AI Access**; no shared API-key backend is used.

## Android share link

The existing `Android Release` GitHub Actions workflow builds a signed APK and AAB, publishes the AAB to Play testing, and attaches the signed APK to the latest GitHub Release.

1. Add the signing and Play secrets listed at the top of `.github/workflows/android-release.yml` to the fork.
2. Increment `versionCode` in `android/app/build.gradle.kts`.
3. Push a tag such as `android-v7.2`.
4. Share either the Play testing opt-in URL from Play Console or this stable direct-download URL:

   `https://github.com/yojimbo187-alt/fud-ai/releases/latest/download/ruoka-treeni-android.apk`

Android may ask recipients to allow installs from their browser or file manager when using the direct APK link. The workflow also publishes Sigstore bundles and build provenance beside the APK.

## iOS TestFlight public link

The existing iOS release setup uses Xcode Cloud to archive and upload tagged `v*` builds to App Store Connect. Apple requires the account holder to enable a public TestFlight group; that link cannot be created from repository code without access to the Apple Developer team.

1. Connect this fork and the `calorietracker` scheme to Xcode Cloud, preserving the existing Release workflow.
2. Push a tag such as `v7.2` and wait for the build to finish processing in App Store Connect.
3. In **App Store Connect → Apps → Ruoka + Treeni → TestFlight**, create an external group, add the processed build, complete Beta App Review details, and submit the build for Beta App Review.
4. After approval, enable **Public Link** for the group, set an optional tester limit, and share the generated `https://testflight.apple.com/join/...` URL.

The public TestFlight URL remains stable for that group; later approved builds can be added to the same group without changing the link.
