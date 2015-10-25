/// <reference path="../Scheduler.ts"/>

namespace Fate.Runtime {
  var slice = Array.prototype.slice;

  function noOp() {}

  export interface Channel {
    (...args: any[]): void;
    __fateChannel?: boolean;
  }

  export function defineChannel(value: Channel) {
    value.__fateChannel = true;
    return value;
  }

  export function defineGuardedChannel(originalChannel: Function,
                                       envelope: Function) {
    if ( !isFateChannel(originalChannel) ) {
      originalChannel = noOp;
    }
    return defineChannel(envelope(originalChannel));
  }

  export function isFateChannel(channel: any) {
    return typeof channel === 'function' && channel.__fateChannel;
  }

  class JoinArguments {
    public consumed: boolean;
    public argumentArray: any[];

    constructor(callArguments: IArguments) {
      this.argumentArray = [this].concat(slice.call(callArguments));
    }
  }

  export function joinArguments(joinArgs?: JoinArguments) {
    if ( joinArgs instanceof JoinArguments ) {
      return joinArgs.argumentArray;
    }
    return new JoinArguments(arguments).argumentArray;
  }

  export function join(body: Function, ...argCount: number[]) {
    var satisfied = false;
    var argumentSets: JoinArguments[][] = [];
    return provideArguments;

    function provideArguments(signatureIndex: number, args: JoinArguments) {
      if ( satisfied ) {
        return;
      }

      // This is not the most efficient implementation... don't care
      var argumentSet = argumentSets[signatureIndex];
      if ( argumentSet ) {
        argumentSet.push(args);
      }
      else {
        argumentSets[signatureIndex] = [args];
      }
      attemptToSatisfy();
    }

    function attemptToSatisfy() {
      var argumentIndexes:number[] = [];
      for ( var i = 0; i < argCount.length; i++ ) {
        var argumentSet = argumentSets[i];
        if ( !argumentSet ) {
          return;
        }

        for ( var j = 0; j < argumentSet.length; j++ ) {
          var args = argumentSet[j];
          if ( !args || args.consumed ) {
            continue;
          }
          argumentIndexes[i] = j;
          break;
        }

        if ( argumentIndexes[i] === undefined ) {
          return;
        }
      }
      satisfyWith(argumentIndexes);
    }

    function satisfyWith(argumentIndexes: number[]) {
      var args: any[] = [];
      var argsLength = 0;

      argumentIndexes.forEach(function (argumentIndex, setIndex) {
        var argumentSet = argumentSets[setIndex];
        var inputArgs = argumentSet[argumentIndex];
        inputArgs.consumed = true;
        args = args.concat(inputArgs.argumentArray.slice(1));
        argsLength += argCount[setIndex];
        args.length = argsLength;
      });

      satisfied = true;
      argumentSets = null;
      GlobalScheduler.queue(body, args);
    }
  }
}