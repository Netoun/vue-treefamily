<template>
  <v-layout v-resize="onResize" ref="container" class="svg-container"></v-layout>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Home',
  props: ['tree'],
  data: () => {
    return {
      windowSize : {
        x: 0,
        y: 0
      },
      name : null,
      svg : null,
      node : null,
      link : null,
      defs : null,
      pattern : null,
      heart : null,
      ratio : {}
    }
  },
  mounted() {
    this.onResize()
    const level = this.getLargeWidth([this.tree], 0, 0)
    this.ratio = {
      g : {
        spaceX: 14 - level.depthWidth * 0.9,
        spaceY: level.depthHeight
      },
      circle : {
        width : 35 - level.depthWidth * 1
      },
      text : {
        size : 40 - (level.depthWidth * level.depthHeight),
        dy :  6 - level.depthHeight
      }
    }
    this.svg = d3
      .select(this.$el)
      .data(d3.entries(this.orientations(level)))
      .append('svg')
      .attr('viewBox', `0 0 ${this.windowSize.x} ${this.windowSize.y}` )
      .classed('svg-content', true)
      .call(
        d3
          .zoom()
          .scaleExtent([0.5, 8])
          .on('zoom', this.zoom)
      )
      .append('g')
    this.draw()
  },
  methods: {
    getLargeWidth(tree, width, height) {
      const newTree = tree.reduce((a, b)=> {
        if(b.children)
          return [...a, ...b.children]
        return a
      }, [])
      const depthWidth = newTree.length > width ? newTree.length : width
      const depthHeight = height + 1
      if(newTree.length) {
        return this.getLargeWidth(newTree, depthWidth, depthHeight)
      }
      return { depthWidth, depthHeight}
    },
    zoom() {
      this.svg.attr('transform', d3.event.transform)
    },
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    orientations(level) {
      return {
        'top-to-bottom': {
          size: [this.windowSize.x + (50 * level.depthWidth * 0.8), this.windowSize.y - (600 / level.depthHeight)],
          x: d => {
            return d.x
          },
          y: d => {
            return d.y
          }
        }
      }
    },
    draw() {
      this.svg.each(orientation => {
        const o = orientation.value
        const treemap = d3
          .tree()
          .size(o.size)
          .separation(() => 1)
        const nodes = treemap(d3.hierarchy(this.tree))
        const heart = treemap(d3.hierarchy(this.tree))
        const links = nodes.descendants().slice(1)
        const translateX = -50 * this.ratio.g.spaceX
        this.node = this.svg
          .selectAll('.node')
          .data(nodes.descendants())
          .enter()
          .append('g')
          .attr('transform', `translate(${translateX}, 100)`)

        this.node
          .append('line')
          .attr('x1',d => {
            return d.data.type === 'solo'
              ? d.x
              : d.x + this.windowSize.x / 25 - d.depth * 5
          })
          .attr('y1', d => d.y - d.depth)
          .attr('x2', d => {
             return d.data.type === 'solo'
              ? d.x
              : d.x - this.windowSize.x / 25 + d.depth * 5
          })
          .attr('y2', d => d.y - d.depth)
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .style('display', d => (d.data.type === 'solo' ? 'none' : ''))



        this.node
          .append('circle')
          .attr('class', 'node')
          .attr('stroke', '#0c6485')
          .attr('stroke-width', 4)
          .attr('r', this.ratio.circle.width)
          .attr('cx', d => {
            return d.data.type === 'solo'
              ? d.x
              : d.x - this.windowSize.x / this.ratio.g.spaceX / 6
          })
          .attr('cy', d => d.y - d.depth)
          .attr('fill', 'white')

        this.node.filter(d =>{
            return d.data.type !== 'solo'
          })
          .append('circle')
          .attr('class', 'node')
          .attr('stroke', '#a4a246')
          .attr('stroke-width', 4)
          .attr('r', this.ratio.circle.width)
          .attr('fill', 'white')
          .attr('cx', d => {
            return d.data.type === 'solo'
              ? d.x
              : d.x + this.windowSize.x  / this.ratio.g.spaceX / 6
          })
          .attr('cy', d => d.y - d.depth)


        this.node
          .append('text')
          .text(d => {
            return d.data.origin
          })
          .attr('x', d => {
            return d.data.type === 'solo'
              ? d.x
              : d.x - this.windowSize.x / this.ratio.g.spaceX / 6
          })
          .attr('dy', -o.size[0] / 35)
          .attr('text-anchor', 'middle')
          .attr('y', d => d.y + this.ratio.text.dy * 20)
          .attr('font-size', this.ratio.text.size)
          .attr('class', 'name')

        this.node.filter(d =>{
            return d.data.type !== 'solo'
          })
          .append('text')
          .text(d => {
            return d.data.partner
          })
          .attr('x', d => {
            return d.data.type === 'solo'
              ? d.x
              : d.x + this.windowSize.x / this.ratio.g.spaceX / 6
          })
          .attr('dy', -o.size[0] / 35)
          .attr('y', d => d.y + this.ratio.text.dy * 20)
          .attr('font-size', this.ratio.text.size)
          .attr('text-anchor', 'middle')
          .attr('class', 'name')
        this.link = this.svg
          .selectAll('.link')
          .data(links)
          .enter()
          .append('path')
          .attr('class', 'link')
          .attr('d', d => {
            return (
              'M' +
              this.getXLinks(d.data.type, d.x, d.depth) +
              ',' +
              this.getYLinks(d.y) +
              'C' +
              this.getXLinks(d.data.type, d.x, d.depth) +
              ',' +
              (this.getYLinks(d.y - 1) + this.getYLinks(d.parent.y)) / 2 +
              ' ' +
              this.getXLinks(d.data.type, d.data.type === 'solo' ? d.parent.x : d.parent.x + 50, d.depth) +
              ',' +
              (o.y(d) + o.y(d.parent)) / 2 +
              ' ' +
              d.parent.x +
              ',' +
              o.y(d.parent)
            )
          })
          .attr('transform', `translate(${translateX}, 100)`)

        this.heart = this.svg
          .selectAll('.image')
          .data(heart.descendants())
          .enter()
          .append('g')
          .attr('transform', `translate(${translateX}, 100)`)

        this.heart.filter(function(d){
          return d.data.type !== 'solo'
        }).append('image')
          .attr('class', 'image')
          .attr('xlink:href','https://upload.wikimedia.org/wikipedia/commons/c/c8/Love_Heart_symbol.svg')
          .attr('width', 25)
          .attr('height', 25)
          .attr('x', d => d.x - 13)
          .attr('y', d => d.y - 12)

      })
    },
    getXLinks(type, x) {
      return type === 'solo' ? x : x - this.windowSize.x / this.ratio.g.spaceX / 6
    },
    getYLinks(y) {
      return y - 70
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

.link {
  fill: none;
  stroke: #000;
}

.title {
  font-family: "Satisfy", cursive;
}

.name {
  font-family: "Satisfy", cursive;
}
</style>
