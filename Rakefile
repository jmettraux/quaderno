
#
# testing

task :test do

  sh 'ruby test/test.rb'
end

task :default => :test

#
# to the web

task :upload do

  account = 'jmettraux@rubyforge.org'
  webdir = '/var/www/gforge-projects/ruote/quaderno/'

  sh "rsync -azv -e ssh public/ #{account}:#{webdir}"
end

