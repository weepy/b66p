<script>
import ProjectComponent from '../components/ProjectComponent.svelte'



import projectData from './demoProjectData.js'
import { projectStore, uiStore, transportStore } from '../stores/rootStore.js'


projectStore.load(projectData)
uiStore.load({})
transportStore.load( projectData.transports[0])

</script>


<ProjectComponent />



