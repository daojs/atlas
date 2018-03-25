import Compiler from './compiler';

export default function compile(ql, procs) {
  return new Compiler(procs).compile(ql);
}
