var phantom = require('phantom')

function renderHtml(students) {
  function renderStudentHtml(student) {
    return [
      '<section>',
      '  <p>Student: ' + student.name + ' (' + student.source.join(':') + ')</p>',
      '</section>',
    ].join('\n')
  }
  return [].concat([
    '<!DOCTYPE html>',
    '<html>',
    '  <head>',
    '    <style>',
    '      section { border-top: 2px solid blue; page-break-after: always; }',
    '      pre { background-color: #eee; }',
    '    </style>',
    '  </head>',
    '  <body>',
  ], students.map(renderStudentHtml), [
    '  </body>',
    '</html>',
  ]).join('\n')
}

function genPdfFileFromHtml(filePath, html, callback) {
  phantom.create()
    .then(function(ph) {
      return ph.createPage()
    })
    .then(function(page) {
      return page.property('content', html) ? page : null
    })
    .then(function(page){
      return page.render(filePath) ? page : null
    })
    .then(function(page) {
      page.phantom.exit()
      callback()
    })
    .catch(callback)
}

module.exports = {
  renderHtml: renderHtml,
  genPdfFileFromHtml: genPdfFileFromHtml,
}