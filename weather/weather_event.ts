const EventEmitter = require('events');

export interface Observer {
    update(temperature, humidity, preassure): void;
}

export interface Observable {
    registerObserver(o: Observer): void;
    removeObserver(o: Observer): void;
    notifyObservers(): void;
}

export class WeatherData extends EventEmitter implements Observable {
	private temperature;
	private humidity;
	private preassure;
	private observers: Set<Observer> = new Set();

	public registerObserver(observer: Observer): void{
		this.observers.add(observer);
	}

    public removeObserver(observer: Observer): void{
		this.observers.delete(observer);
	}

	public notifyObservers(): void{
        this.observers.forEach(observer => observer.update(this.temperature, this.humidity, this.preassure));
	}

	public setMeasurement (temperature, humidity, preassure){
		this.temperature = temperature;
		this.humidity = humidity;
		this.preassure = preassure;
		this.emit('dataChanged', this.temperature, this.humidity, this.preassure);
	}
}

export class Display implements Observer{
	private temperature;    
	private humidity;
	private preassure;

	public update(temperature, humidity, preassure){
		this.temperature = temperature;
		this.humidity = humidity;
		this.preassure = preassure;
		console.log(this.temperature, this.humidity, this.preassure);
	}
}

const weatherData = new WeatherData();
const display1 = new Display();
const display2 = new Display();
const display3 = new Display();

weatherData.on('dataChanged', function(temperature, humidity, preassure){
	this.notifyObservers(temperature, humidity, preassure);
})

weatherData.registerObserver(display1);
weatherData.registerObserver(display2);
weatherData.registerObserver(display3);

weatherData.setMeasurement(80, 65, 30.4);


