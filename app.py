from flask import Flask, render_template, request, jsonify
import time

app = Flask(__name__)

buses = {}

@app.route("/")
def tracker():
    return render_template("tracker.html")

@app.route("/viewer")
def viewer():
    return render_template("viewer.html")

@app.route("/update_location", methods=["POST"])
def update_location():

    data = request.json
    bus_id = data.get("bus", "default")

    buses[bus_id] = {
        "lat": data["lat"],
        "lng": data["lng"],
        "timestamp": time.time()
    }

    return jsonify({"status":"success"})


@app.route("/get_locations")
def get_locations():
    return jsonify(buses)


if __name__ == "__main__":
    app.run()
