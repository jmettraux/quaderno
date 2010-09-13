
#
# TO THE WEB

task :upload do

  account = 'jmettraux@rubyforge.org'
  webdir = '/var/www/gforge-projects/ruote/quaderno/'

  sh "rsync -azv -e ssh public/ #{account}:#{webdir}"
end

