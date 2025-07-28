import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase


@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  var splashView: UIView?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    FirebaseApp.configure()

       let mainWindow = UIWindow(frame: UIScreen.main.bounds)
       self.window = mainWindow
    // ✅ Show splash screen
      let splash = UIView(frame: mainWindow.bounds)
      splash.backgroundColor = .white

      let logo = UIImageView(image: UIImage(named: "splash_screen")) // Make sure this image exists in Assets
      logo.contentMode = .scaleAspectFit
      logo.translatesAutoresizingMaskIntoConstraints = false
      splash.addSubview(logo)

      NSLayoutConstraint.activate([
        logo.centerXAnchor.constraint(equalTo: splash.centerXAnchor),
        logo.centerYAnchor.constraint(equalTo: splash.centerYAnchor),
        logo.widthAnchor.constraint(equalToConstant: 200),
        logo.heightAnchor.constraint(equalToConstant: 200)
      ])

      splashView = splash
      mainWindow.addSubview(splash)

    factory.startReactNative(
      withModuleName: "RNBoilerplate",
      in: window,
      launchOptions: launchOptions
    )
    
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
        self.splashView?.removeFromSuperview()
        self.splashView = nil
      }

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
