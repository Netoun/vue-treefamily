<template>
  <div ref="container" class="svg-container">
    <h1 :data-heading="name" class="title">Famille {{ name }}</h1>
  </div>
</template>

<script>
import familyJSON from '../data/family.json'
import * as d3 from 'd3'

export default {
  name: 'Home',
  data: () => {
    return {
      tree: null,
      name: null,
      svg: null,
      node: null,
    }
  },
  created() {
    [this.name, this.tree] = Object.values(familyJSON)
  },
  mounted() {
    this.svg = d3
      .select(this.$el)
      .data(d3.entries(this.orientations()))
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr(
        'viewBox',
        `0 0 ${this.$refs.container.clientWidth} ${this.$refs.container.clientHeight}`
      )
      .classed('svg-content', true)
      .call(d3.zoom()
      .scaleExtent([.5, 8])
      .on('zoom', this.zoom))
      .append('g')
    this.draw()
  },
  methods: {
    zoom() {
      this.svg.attr('transform', d3.event.transform)
    },
    orientations() {
      return {
        'top-to-bottom': {
          size: [
            this.$refs.container.clientWidth,
            this.$refs.container.clientHeight / 3
          ],
          x: d => {
						return d.x
					},
          y: d => {
						return  d.y + this.$refs.container.clientHeight / 22
          }
        }
      }
    },
    draw() {
      this.svg.each(orientation => {
        const o = orientation.value
        const treemap = d3.tree().size(o.size)
        .separation(() => 1)
        const nodes = treemap(d3.hierarchy(this.tree))

        const translateX = 50 - nodes.children.length * 2

        this.node = this.svg
          .selectAll('.node')
          .data(nodes.descendants())
          .enter()
          .append('g')
					.attr('transform', `translate(${translateX}, 100)`)

        this.node
          .append('circle')
          .attr('class', 'node')
          .attr('stroke', '#0c6485')
          .attr('stroke-width', 4)
          .attr('r', d => 25 - d.depth)
          .attr('fill', 'white')
          .attr('cx', d => {
            return d.data.type === 'solo'
              ? d.x
              : d.x - this.$refs.container.clientWidth / 25 + d.depth * 5
          })
          .attr('cy', d => d.y - d.depth )

        this.node
          .append('circle')
          .attr('class', 'node')
          .attr('stroke', '#a4a246')
          .attr('stroke-width', 4)
          .attr('r', d => 25 - d.depth)
          .attr('fill', 'white')
          .attr('cx', d => {
            return d.data.type === 'solo'
              ? d.x 
              : d.x + this.$refs.container.clientWidth / 25 - d.depth * 5
          })
          .attr('cy', d => d.y - d.depth )
          .style('display', d => d.data.type === 'solo' ? 'none' : '')

        this.node
          .append('text')
          .text(d => {
            return d.data.origin
          })
          .attr('x', d => {
            return d.data.type === 'solo'
              ? d.x
              : d.x - this.$refs.container.clientWidth / 25 + d.depth * 5
          })
          .attr('dy', -o.size[0] / 35)
          .attr('text-anchor', 'middle')
          .attr('y', d => d.y - d.depth )
          .attr('font-size', d => { return o.size[0] / 100 - d.depth })
          .attr('class', 'name')

        this.node
          .append('text')
          .text(d => {
            return d.data.partner
          })
          .attr('x', d => {
            return d.data.type === 'solo'
              ? d.x
              : d.x + this.$refs.container.clientWidth / 25 - d.depth * 5
          })
          .attr('dy', -o.size[0] / 35)
          .attr('y', d => d.y - d.depth )
          .attr('font-size', d => { return o.size[0] / 100 - d.depth })
          .attr('text-anchor', 'middle')
          .attr('class', 'name')
      })
    }
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Satisfy&display=swap");

.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  vertical-align: top;
  overflow: hidden;

  .svg-content {
    display: inline-block;
    position: absolute;
    left: 0;
  }
}


.title {
  font-family: "Satisfy", cursive;
}

.name {
  font-family: "Satisfy", cursive;
}
</style>
