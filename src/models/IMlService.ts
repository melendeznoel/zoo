export interface IMlService {
  startTraining: () => Promise<boolean>
  runner: (value: string) => Promise<any>
}
