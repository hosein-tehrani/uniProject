// give the hosted domain here 
module.exports = {
    url: process.env.NODE_ENV === 'production' ? 'http://ppk.satrapp.com/api/' : 'http://localhost/api/',
    hardcode_url: process.env.NODE_ENV === 'production' ? 'ppk.satrapp.com/api/' : 'localhost/api/',

    token: '9dfa0cf455fb5c2cc44f145fb5642fe72b156c5a'
}