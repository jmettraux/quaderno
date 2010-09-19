
#
# testing quaderno
#
# Mon May 31 09:45:27 JST 2010
#

files = Dir[File.join(File.dirname(__FILE__), 'qt_*.js')]

if a = ARGV[0]
  files = files.select { |f| f.match('qt_' + a + '_.+\.js$') }
end

`rhino -e '1'`
js = ($?.exitstatus == 0) ? 'rhino -debug' : 'js'

files.each do |t|
  puts '. ' + t
  o = `#{js} #{t} #{t}`
  puts o if o.size > 0
end

