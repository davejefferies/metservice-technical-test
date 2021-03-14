import React from 'react';
import { Line } from 'react-chartjs-2';
import Moment from 'moment';
import './Dashboard.scss';
import { APIService } from '../../services/api-service';

const columns: any = {
    "a": {
        key: "sea_surface_wave_significant_height",
        color: "75,192,192",
        label: "Significant"
    },
    "b": {
        key: "air_temperature_at_2m_above_ground_level",
        color: "75,192,192",
        label: "Air Temperature at 2m Above Ground Level"
    },
    "c": {
        key: "wind_from_direction_at_10m_above_ground_level",
        color: "75,192,192",
        label: "Wind from direction at 10m above ground level"
    },
    "d": {
        key: "wind_speed_at_10m_above_ground_level",
        color: "75,192,192",
        label: "wind speed at 10m above ground level"
    },
    "e": {
        key: "sea_surface_wave_from_direction_at_variance_spectral_density_maximum",
        color: "43, 82, 222",
        label: "variance spectral density maximum"
    },
    "f": {
        key: "sea_surface_wave_maximum_height",
        color: "43, 82, 222",
        label: "Maximum"
    },
    "g": {
        key: "surface_sea_water_speed",
        color: "75,192,192",
        label: "surface sea water speed"
    },
};

const getRequest = (type: string) => {
    return new APIService()
    .setHeaders([
        {
            key: 'Accept',
            value: 'application/' + type
          }, {
            key: 'Content-Type',
            value: 'application/' + type
          }
    ])
    .setMethod('GET')
    .setURL('data.' + type);
}

const convertCSV = (csv: any) => {
    if (typeof csv != 'string')
        return [];
    let allLines: any = csv.split(/\r|\n|\r/);
    let headers: any = allLines[0].split(',');
    let lines: any = {};
    for(let i = 1; i < allLines.length; i++) {
        if (allLines[i]) {
            let data = allLines[i].split(',');
            headers.forEach((header: any, idx: number) => {
                if (idx === 0)
                    lines[data[0]] = {};
                else
                    lines[data[0]][header] = data[idx] === "null" ? null : data[idx];
            });
        }
    }
    return lines;
}

const combine = (objs: any) => {
    let newObj: any = {};
    objs.forEach((obj: any) => {
        Object.keys(obj).forEach((dt: any) => {
            if (!(dt in newObj))
                newObj[dt] = {dateTime: Moment(dt).format("DD/MM/YYYY HH:mm:ss")};
            Object.keys(columns).forEach((col: any) => {
                if (!(columns[col].key in newObj[dt]))
                    newObj[dt][columns[col].key] = null;
                if (columns[col].key in obj[dt])
                    newObj[dt][columns[col].key] = obj[dt][columns[col].key];
            });
        });
    });
    let sorted: any = Object.keys(newObj).sort();
    let sortedObj: any = {};
    sorted.forEach((item: string) => {
        let d: string = Moment(item).format("DD/MM/YYYY HH:mm:ss");
        sortedObj[d] = newObj[item];
    });

    return sortedObj;
}

const removeEmpty = (cols: any, data: any) => {
    let newObj: any = {};
    Object.keys(data).forEach((item: any) => {
        let bln: boolean = false;
        cols.forEach((col: any) => {
            if (data[item][col.key] !== null)
                bln = true;
        });
        if (bln)
            newObj[item] = data[item];
    });

    return newObj;
}

const getDataSet = (column: any, data: any, fill: any) => {
    return {
        position: 'right',
        label: column.label,
        data: Object.values(data).map((obj: any) => { return obj[column.key]; }),
        fill: fill,
        backgroundColor: 'rgb(' + column.color + ')',
        borderColor: 'rgba(' + column.color + ', 0.7)'
    }
}


const getOptions = (title: string, labels: any, legend: boolean) => {
    let ret = {
        responsive: true,
        title: {
            display: true,
            position: 'top',
            fontSize: 22,
            text: title
        },
        legend: {
            display: legend
        },
        tooltips: {
            mode: 'label'
        },
        elements: {
            line: {
                fill: false
            }
        },
        scales: {
            yAxes: labels.map((obj: any) => { 
                return {
                    scaleLabel: {
                        display: true,
                        labelString: obj
                    }
                }; 
            }),
            xAxes: [{
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 20
                }
            }]
        }
    }
    return ret;
}

const Dashboard: React.FC = () => {
    let jsonData = getRequest('json').execute();
    let csvData = getRequest('csv').execute();
    let csv = convertCSV(csvData);
    let combined = combine([jsonData, csv]);
    let data1 = removeEmpty([columns.a, columns.f], combined);
    var dataset1 = {
        labels: Object.keys(data1),
        datasets: [
            getDataSet(columns.f, data1, 1),
            getDataSet(columns.a, data1, 'origin')
        ]
    };
    let options1 = getOptions('Sea Surface Wave Height', ['Meters'], true);
    
    let data2 = removeEmpty([columns.g], combined);
    var dataset2 = {
        labels: Object.keys(data2),
        datasets: [
            getDataSet(columns.g, data2, false)
        ]
    };
    let options2 = getOptions('Sea Surface Water Speed', ['KM/H'], false);

    let data3 = removeEmpty([columns.b], combined);
    var dataset3 = {
        labels: Object.keys(data3),
        datasets: [
            getDataSet(columns.b, data3, false)
        ]
    };
    let options3 = getOptions('Air Temperature 2m Above Ground', [], false);

    let data4 = removeEmpty([columns.d], combined);
    var dataset4 = {
        labels: Object.keys(data4),
        datasets: [
            getDataSet(columns.d, data4, false)
        ]
    };
    let options4 = getOptions('Wind Speed 10m Above Ground', ['KM/H'], false);

    return (
        <div id="dashboard">
            <div className="line">
                <Line data={dataset1} options={options1} />
            </div>
            <div className="line">
                <Line data={dataset2} options={options2} />
            </div>
            <div className="line">
                <Line data={dataset3} options={options3} />
            </div>
            <div className="line">
                <Line data={dataset4} options={options4} />
            </div>
        </div>
    );
}

export default Dashboard;
