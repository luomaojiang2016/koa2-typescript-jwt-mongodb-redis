import * as fs          from 'fs';
import * as path        from 'path';
//import * as colors      from 'colors';


const MaxLogCountPerFile = 10000;

class Logger{
    private fsLogger:   Console;
    private logCount:   number = 0;
    private logPath:    string;

    public redBegin:     string = '\x1B[31m';
    public yellowBegin:  string = '\x1B[33m';
    public greenBegin:  string = '\x1B[34m';
    public colorEnd:     string = '\x1B[39m';

    constructor(){
    }

    private getLogPrefix(type): string{
        const timeInfo = this.getCurrentTimeInfo();

        const timeString = `${timeInfo.year}-${timeInfo.month}-${timeInfo.day} ` + 
                           `${timeInfo.hour}:${timeInfo.minute}:${timeInfo.second}.${timeInfo.mmsecond}`;

        return `[${timeString}] [${type}]`;
    }

    private checkLogCount(): void{
        this.logCount++;
        if (this.logCount >= MaxLogCountPerFile){
            this.setLogPath(this.logPath);
            this.logCount = 0;
        }
    }

    private getCurrentTimeInfo(): any{
        const now = new Date();
        const year = now.getFullYear();
        
        let month: number | string = now.getMonth() + 1;
        if (month < 10){
            month = '0' + month;
        }

        let day: number | string = now.getDate();
        if (day < 10){
            day = '0' + day;
        }

        let hour: number | string = now.getHours();
        if (hour < 10){
            hour = '0' + hour;
        }

        let minute: number | string = now.getMinutes();
        if (minute < 10){
            minute = '0' + minute;
        }

        let second: number | string = now.getSeconds();
        if (second < 10){
            second = '0' + second;
        }

        let mmsecond: number | string = now.getMilliseconds();
        if (mmsecond < 10){
            mmsecond = '00' + mmsecond;
        }else if (mmsecond < 100){
            mmsecond = '0' + mmsecond;
        }

        return {
            year,
            month,
            day,
            hour,
            minute,
            second,
            mmsecond
        };
    }

    public setLogPath(logPath: string): void{
        this.logPath = logPath;

        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath);
        }

        const timeInfo = this.getCurrentTimeInfo();

        const timeString = `${timeInfo.year}-${timeInfo.month}-${timeInfo.day} ` + 
                           `${timeInfo.hour}-${timeInfo.minute}-${timeInfo.second}`;

        const fileName = path.join(logPath, `${timeString}.log`);
        const output = fs.createWriteStream(fileName);

        this.fsLogger = null;
        this.fsLogger = new console.Console(output);
    }

    public log(...args): void{
        const prefix = this.getLogPrefix('LOG');
        console.log(prefix, ...args);

        if (this.fsLogger){
            this.fsLogger.log(prefix, ...args);
            this.checkLogCount();
        }
    }

    public info(...args): void{
        const prefix = this.getLogPrefix('INFO');
        console.info(this.greenBegin,prefix, ...args,this.colorEnd);
        
        if (this.fsLogger){
            this.fsLogger.info(prefix, ...args);
            this.checkLogCount();
        }
    }

    public trace(...args): void{
        const prefix = this.getLogPrefix('TRACE');
        console.trace(prefix, ...args);
        
        if (this.fsLogger){
            this.fsLogger.trace(prefix, ...args);
            this.checkLogCount();
        }
    }

    public warn(...args): void{
        const prefix = this.getLogPrefix('WARN');
        console.warn(this.yellowBegin, prefix, ...args, this.colorEnd);
        
        if (this.fsLogger){
            this.fsLogger.warn(prefix, ...args);
            this.checkLogCount();
        }
    }

    public error(...args): void{
        const prefix = this.getLogPrefix('ERROR');
        console.log(this.redBegin, prefix, ...args, this.colorEnd);
        
        if (this.fsLogger){
            this.fsLogger.error(prefix, ...args);
            this.checkLogCount();
        }
    }

    public spaceRow(): void{
        console.log('');
        
        if (this.fsLogger){
            this.fsLogger.log('');
        }
    }
}

export const logger = new Logger();