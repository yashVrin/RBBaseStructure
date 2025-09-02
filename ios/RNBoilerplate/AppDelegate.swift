import UIKit
import React
import React_RCTAppDelegate
import Firebase

@UIApplicationMain
class AppDelegate: RCTAppDelegate {
  // Where to load the JS bundle from
 override func sourceURL(for bridge: RCTBridge!) -> URL! {
#if DEBUG
   return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackExtension: nil)
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
}

  // Configure RN root component and props during launch
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    if FirebaseApp.app() == nil {
      if Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") != nil {
        FirebaseApp.configure()
      } else {
        NSLog("GoogleService-Info.plist missing - skipping Firebase configuration")
      }
    }

    // Set module and props before calling super
    self.moduleName = "RNBoilerplate" // must match app.json name
    self.initialProps = [:]

    let didFinish = super.application(application, didFinishLaunchingWithOptions: launchOptions)

    // Optional simple splash overlay (can be commented if debugging white screen)
    let mainWindow = self.window
    let splash = UIView(frame: mainWindow.bounds)
    splash.backgroundColor = .white

    let logo = UIImageView(image: UIImage(named: "splash_screen"))
    logo.contentMode = .scaleAspectFit
    logo.translatesAutoresizingMaskIntoConstraints = false
    splash.addSubview(logo)

    NSLayoutConstraint.activate([
      logo.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
      logo.centerYAnchor.constraint(equalTo: splash.centerYAnchor),
      logo.widthAnchor.constraint(equalToConstant: 200),
      logo.heightAnchor.constraint(equalToConstant: 200)
    ])

    mainWindow.addSubview(splash)

    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
      splash.removeFromSuperview()
    }


    return didFinish
  }
}
