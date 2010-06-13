
#require 'rubygems'
#require 'rake'


#
# TO THE WEB

task :upload do

  account = 'jmettraux@rubyforge.org'
  webdir = '/var/www/gforge-projects/ruote/quaderno/'

  sh "rsync -azv -e ssh js stylesheets page*.html #{account}:#{webdir}"
end

