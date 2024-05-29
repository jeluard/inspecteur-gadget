client.post('Profiler.enable');
client.post('Profiler.start');

const file = 'profile.cpuprofile';
console.log(`Profiling started. Hit Ctrl+c to stop and save the profile to ${file}`);

async () => {
    const profiler = await client.post('Profiler.stop');
    if (profiler.result) {
        const {writeFileSync} = await import("node:fs");
        writeFileSync(file, JSON.stringify(profiler.result.profile));
    }
}