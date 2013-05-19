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
        self.response.write(JINJA_ENVIRONMENT.get_template('index.html').render())

app = webapp2.WSGIApplication([
    ('/', MainHandler),
], debug = True)
