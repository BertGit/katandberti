var express = require('express')
var router = express.Router()

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('guestdb', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS guests")
        console.log('Create table if not exists');
        db.run("CREATE TABLE IF NOT EXISTS guests (id TEXT PRIMARY KEY, adults TEXT, children TEXT, rsvp TEXT default 'UNKNOWN', comment TEXT, last_visited INTEGER)")
        console.log('Created Table');
        db.run("INSERT INTO guests (id,adults,children) VALUES ('aE9r','Berti,Kat','Jojo')")
        db.run("INSERT INTO guests (id,adults,children,rsvp,comment,last_visited) VALUES ('bE9r','Stephanie',NULL,'ACCEPTED',NULL,1527967287)")
        db.run("INSERT INTO guests (id,adults,children,rsvp,comment,last_visited) VALUES ('cE9r','Reinhard',NULL,'DECLINED',NULL,1527967287)")
    })
});

router.get('/', (req, res) => {
    res.render('index')
})
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})
router.post('/dashboard', (req, res) => {
    console.log(req.body)
    if (req.body.pwd === '123') {
        res.render('dashboard', { loggedin: true })
    } else {
        res.render('dashboard', { wrongpwd: true })
    }
})
router.get('/:id', (req, res) => {
    const id = req.params.id
    db.get("SELECT adults, children, rsvp FROM guests WHERE id = ?", id, (err, row) => {
        if (err) {
            res.sendStatus(500)
            return
        }
        if (row) {
            db.run("UPDATE guests SET last_visited = ? WHERE id = ?", parseInt(new Date().getTime() / 1000), id)
            res.render('index', {
                id: id,
                guestName: row.adults.split(",").join(" & "),
                rsvp: row.rsvp
            })
        } else {
            res.render('index')
        }
    })
})
router.get('/api/guests', (req, res) => {
    let data = []
    db.each("SELECT id, adults, children, rsvp, comment, last_visited FROM guests", (err, row) => {
        data.push([
            row.id, row.adults, row.children, row.rsvp, row.comment, row.last_visited ? new Date(row.last_visited * 1e3).toISOString() : 'Not visited yet'
        ])
    }, (err) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.json({
                data: data
            })
        }
    })
})
router.post('/api/update/:id/:status', (req, res) => {
    console.log(req.body)
    const id = req.params.id
    const status = req.params.status
    if (status !== "accept" && status !== "decline") {
        console.log(`Unknown status ${status}`)
        res.json({ "success": false })
        return
    }
    const rsvp = status === "accept" ? "ACCEPTED" : "DECLINED"
    db.run("UPDATE guests SET rsvp = ? WHERE id = ?", rsvp, id, (err) => {
        if (err) {
            console.log("Error trying to update records")
            console.log(err)
            res.json({ "success": false })
            return
        }
        res.json({ "success": true })
    })
})
router.post('/api/comment/:id', (req, res) => {
    console.log(req.body)
    const id = req.params.id
    const comment = req.body.comment
    db.run("UPDATE guests SET comment = ? WHERE id = ?", comment, id, (err) => {
        if (err) {
            console.log("Error trying to update records")
            console.log(err)
            res.json({ "success": false })
            return
        }
        res.json({ "success": true })
    })
})

module.exports = router
