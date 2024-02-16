require "json"
# pod 'GRDB.swift'

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-pushdy"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-pushdy
                   DESC
  s.homepage     = "https://github.com/Pushdy/react-native-pushdy"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Pushdy" => "contact@pushdy.com" }
  s.platforms    = { :ios => "9.0" }

  # Force support Swift version
  s.swift_versions = ['4.2', '5.0']

  s.source       = { :git => "https://github.com/Pushdy/react-native-pushdy.git", :tag => "#{s.version}" }
  # Temperary install from local
  # s.source       = { :http => 'file:' + __dir__ + '/Archive.zip'}

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  # ...
  # s.dependency "..."
  s.dependency 'PushdySDK', '0.6.2'
end

# post_install do |installer|
#   installer.pods_project.targets.each do |target|
#     if target.name == 'GRDB.swift'
#       target.build_configurations.each do |config|
#         config.build_settings['SWIFT_VERSION'] = '4.2'
#       end
#     end
#   end
# end
