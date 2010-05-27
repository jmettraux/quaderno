
Dir[File.join(File.dirname(__FILE__), 'qt_*.js')].each do |t|
  puts '. ' + t
  o = `js #{t} #{t}`
  puts o if o.size > 0
end

