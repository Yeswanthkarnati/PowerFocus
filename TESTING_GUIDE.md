# PowerFocus: Quick Testing Guide

## 1. Audio File Picker (Audio-Only Filtering)

### Test Case 1.1: Select Valid Audio File
1. Open Settings (OptionsScreen)
2. Tap "Select Custom Ringtone"
3. Browse to an audio file (e.g., MP3, WAV, M4A)
4. Select the file
5. ✅ Expected: File selected successfully, appears in Settings

### Test Case 1.2: Reject Non-Audio File
1. Open Settings
2. Tap "Select Custom Ringtone"
3. Try to select a non-audio file (e.g., PDF, image, document)
4. ✅ Expected: Error alert: "Please select a supported audio file."

### Test Case 1.3: File Storage
1. After selecting audio in Test 1.1
2. Verify file was copied to app's document directory
3. ✅ Expected: File path should be `file:///data/data/com.powerfocus/documents/...` (Android) or similar (iOS)

## 2. BootSplash (Splash Screen)

### Test Case 2.1: Android BootSplash
1. Build and run: `npm run android` or via Android Studio
2. Observe app startup
3. ✅ Expected: 
   - Splash screen displays for ~2-3 seconds
   - Shows correct logo and background color (#f2f5f3 light gray)
   - Fades out smoothly
   - Transitions to Timer screen when ready

### Test Case 2.2: iOS BootSplash
1. Build and run: `npm run ios` or via Xcode
2. Observe app startup
3. ✅ Expected:
   - Splash screen displays with correct storyboard
   - Logo and background color visible
   - Fades out when navigation ready

### Test Case 2.3: BootSplash Timing
1. After Test 2.1 or 2.2, verify splash hides when:
   - Navigation container is ready (reactive)
   - NOT after arbitrary delay
2. ✅ Expected: Splash hides when app is functionally ready, not on a timer

## 3. Custom Ringtone Persistence

### Test Case 3.1: Ringtone Persists After Restart
1. Open Settings → Select custom audio file (Test 1.1)
2. Note the selected ringtone name
3. Close app completely
4. Restart app
5. Open Settings
6. ✅ Expected: Custom ringtone still selected, name matches

### Test Case 3.2: Custom Audio Plays on Timer End
1. Open Settings → Select custom audio file
2. Go to Timer screen
3. Set Work duration to 1 minute (or less for testing)
4. Start timer
5. Wait for timer to end
6. ✅ Expected: Custom audio plays when timer reaches zero

### Test Case 3.3: Change Custom Audio
1. Open Settings → Select audio file A
2. Verify it plays on timer end (Test 3.2)
3. Go back to Settings → Select audio file B
4. Start timer again
5. ✅ Expected: Audio file B plays (file A no longer used)

### Test Case 3.4: Reset to Default
1. Open Settings → Select custom audio
2. Tap "Reset Ringtone"
3. Verify ringtone name changes to "Default ringtone"
4. Start timer
5. ✅ Expected: Built-in `ringtone.wav` plays (default sound)

### Test Case 3.5: Persistence After Force-Close
1. Select custom audio in Settings
2. Force-close app (remove from recent apps)
3. Reopen app
4. ✅ Expected: Custom audio still selected

### Test Case 3.6: Persistence After Restart
1. Select custom audio in Settings
2. Fully restart device (power off/on)
3. Reopen app
4. Open Settings
5. ✅ Expected: Custom audio still selected

## 4. Integration Tests

### Test Case 4.1: Full User Flow
1. **Setup**: Select custom audio in Settings
2. **Timer Run**: Start a 1-minute work session
3. **Verify Sound**: Audio plays when timer ends
4. **Change Audio**: Select different audio, restart timer
5. **Verify Persistence**: Close and reopen app, confirm new audio is selected
6. ✅ Expected: All steps work end-to-end

### Test Case 4.2: Rapid Audio Changes
1. Open Settings
2. Change audio 3-4 times in quick succession
3. Start timer
4. ✅ Expected: Only the last selected audio plays (no race conditions)

### Test Case 4.3: Audio During Active Timer
1. Start a 5-minute work session
2. After 2 minutes, go to Settings and change audio
3. Return to timer, let it finish
4. ✅ Expected: New audio plays when timer ends (safe to change during session)

### Test Case 4.4: Silent Mode
1. Select custom audio
2. Start timer, let it end
3. Go to Settings, disable "Sound Enabled"
4. Start another timer, let it end
5. ✅ Expected: No audio plays (respects setting)
6. Re-enable "Sound Enabled", verify audio plays again

## 5. Edge Cases

### Test Case 5.1: Corrupted Audio File
1. Somehow get a corrupted/invalid audio file
2. Try to select it
3. ✅ Expected: Error handling (graceful, no crash)

### Test Case 5.2: Deleted Audio File
1. Select custom audio
2. Delete the file from device storage
3. Restart app
4. Start timer
5. ✅ Expected: Error logged, falls back gracefully (or default audio plays)

### Test Case 5.3: Empty Document Picker
1. Open Settings
2. Tap "Select Custom Ringtone"
3. Cancel without selecting anything
4. ✅ Expected: No error, settings unchanged

### Test Case 5.4: Memory Leak Check
1. Start profiler in Android Studio / Xcode
2. Select audio, start timer, let it end multiple times
3. Change audio multiple times
4. Stop and restart timer multiple times
5. ✅ Expected: Memory stable (no continuous growth)

## 6. Platform-Specific Tests

### Android-Only
- [ ] Document picker shows only audio MIME types
- [ ] `Intent.EXTRA_MIME_TYPES` filter working correctly
- [ ] BootTheme attributes (`bootSplashBackground`, `bootSplashLogo`) applied correctly
- [ ] Splash images display at correct DPI (hdpi, mdpi, xhdpi, etc.)

### iOS-Only
- [ ] Document picker prompts for file access (if needed)
- [ ] BootSplash.storyboard loads correctly
- [ ] Colors.xcassets background color displays
- [ ] Images.xcassets logo displays at correct scale (1x, 2x, 3x)
- [ ] Storyboard referenced in Info.plist correctly

## 7. Performance Checks

### Test Case 7.1: Launch Time
- ✅ Expected: App launches and shows splash in <2 seconds
- Splash hides in <3 seconds (after navigation ready)

### Test Case 7.2: Settings Screen Load
- ✅ Expected: Settings screen opens in <1 second
- Ringtone name displays immediately

### Test Case 7.3: Audio Load Time
- ✅ Expected: Custom audio loads and plays in <500ms
- No lag when timer ends

## 8. Device Testing Checklist

- [ ] Android 10+ (minimum supported version)
- [ ] Android 13+ (latest Android)
- [ ] iOS 13+ (minimum supported version)
- [ ] iOS 17+ (latest iOS)
- [ ] Tablet (landscape/portrait modes)
- [ ] Phone (small/large screens)

---

## Troubleshooting

### Issue: Audio Not Playing
- **Check**: Is "Sound Enabled" toggle ON in Settings?
- **Check**: Is device in Silent/Mute mode?
- **Check**: Is custom audio file accessible? (not deleted)
- **Solution**: Restart app, re-select audio, verify permissions

### Issue: BootSplash Not Showing
- **Android**: Verify `BootTheme` in `styles.xml` points to correct drawable/color
- **iOS**: Verify `BootSplash.storyboard` in build phases, check Info.plist `UILaunchStoryboardName`
- **Solution**: Clean build, rebuild project

### Issue: Audio File Not Selectable
- **Check**: Device permissions for file access
- **Check**: File is valid audio format (not corrupted)
- **Solution**: Grant permissions, try different audio file

### Issue: Ringtone Not Persisting
- **Check**: AsyncStorage permission (not restricted by OS)
- **Check**: Sufficient device storage
- **Solution**: Clear app cache, reinstall app

---

## Build & Test Commands

```bash
# Install dependencies
npm install
cd ios && pod install  # iOS only

# Run on Android
npm run android
# or
./gradlew assembleDebug  # Build APK
./gradlew installDebug   # Install to device

# Run on iOS
npm run ios
# or open ios/PowerFocus.xcworkspace in Xcode

# Run tests
npm run test

# Lint code
npm run lint

# TypeScript check
npx tsc --noEmit
```

---

## Success Criteria

✅ All audio files are accepted and rejected correctly based on type
✅ BootSplash displays with correct assets on app launch
✅ BootSplash hides when navigation is ready (reactive, not time-based)
✅ Custom ringtone persists across app restarts
✅ Custom ringtone plays when timer ends
✅ No crashes or console errors during tests
✅ No memory leaks on repeated audio loads/plays
✅ App launches in <3 seconds
✅ Settings load instantly
✅ Audio plays within 500ms of timer end

---

**Last Updated**: 2025
**Test Version**: 1.0
