require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-pushdy"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-pushdy
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-pushdy"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "9.0" }

  # TODO: Update this source
  # s.source       = { :git => "https://github.com/github_account/react-native-pushdy.git", :tag => "#{s.version}" }
  # Temperary install from local
  s.source       = { :http => 'file:' + __dir__ + '/Archive.zip'}

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  # ...
  # s.dependency "..."
  s.dependency 'PushdySDK', '~> 0.0.6'
end

