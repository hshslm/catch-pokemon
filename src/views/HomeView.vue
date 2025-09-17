<script>
export default {
    methods: {
        startGame() {
            this.$router.push('/capture');
        }
    }
};
</script>

<template>
    <main>
        <h1>Page Title</h1>

        <form id="form-registration">
            <input type="text" name="trainer-name" id="trainer-name" />

            <button @click.prevent="startGame">Start</button>
        </form>
    </main>
</template>
