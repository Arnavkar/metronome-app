import type { TimeSignature, Beat } from '~/types';

export function parseTimeSignature(input:string,bpm:number): TimeSignature {
    const result:TimeSignature = {
      numBeats: 0,
      beats: [] as Beat[]
    };
  
    // Validate the input
    if (typeof input !== 'string' || input.trim() === '') {
      throw new Error('Invalid input: Input should be a non-empty string.');
    }
  
    const sections = input.split('&');
    let currentBeatIndex = 0;
  
    sections.forEach(section => {
      const matches = section.match(/(\((\d+)\/(\d+)\)\*(\d+)|(\d+)\/(\d+))/g);
  
      if (!matches) {
        throw new Error(`Invalid format in section: ${section}`);
      }
  
      matches.forEach(match => {
        let numBeats, beatUnit, repeat = 1;
  
        if (match.includes('(')) {
          const parts = match.match(/\((\d+)\/(\d+)\)\*(\d+)/);
          if (!parts || parts.length !== 4) {
            throw new Error(`Invalid time signature format: ${match}`);
          }
          numBeats = parseInt(parts[1], 10);
          beatUnit = parseInt(parts[2], 10);
          repeat = parseInt(parts[3], 10);
        } else {
          const parts = match.match(/(\d+)\/(\d+)/);
          if (!parts || parts.length !== 3) {
            throw new Error(`Invalid time signature format: ${match}`);
          }
          numBeats = parseInt(parts[1], 10);
          beatUnit = parseInt(parts[2], 10);
        }
  
        if (isNaN(numBeats) || isNaN(beatUnit) || isNaN(repeat)) {
          throw new Error(`Invalid numbers in time signature: ${match}`);
        }
  
        for (let i = 0; i < repeat; i++) {
          for (let j = 0; j < numBeats; j++) {
            const interval = (60 / bpm) * 1000 / (beatUnit / 4);
            result.beats.push({
              beatIndex: currentBeatIndex,
              beatUnit: beatUnit,
              interval: interval
            });
            currentBeatIndex++;
          }
          result.numBeats += numBeats;
        }
      });
    });
  
    return result;
  }

  export function updateTimeSignatureBPM(newBpm:number, timeSignature:TimeSignature):TimeSignature{
    timeSignature.beats.forEach(beat => {
      beat.interval = (60 / newBpm) * 1000 / (beat.beatUnit / 4);
    });
    return timeSignature;
  }