#!/usr/bin/env python

import os

import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader = jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'html')),
    extensions = ['jinja2.ext.autoescape']
)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        values = { 'value': 'hello stack-instant' }
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render(values))

class BlankHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('')

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/blank', BlankHandler)
], debug = True)
